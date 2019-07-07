from __future__ import absolute_import

from six.moves import range

from automation import CommandSequence, TaskManager

import os
from test.utilities import LocalS3Session, local_s3_bucket
from download_s3_directory import download_s3_directory
import boto3
from localstack.services import infra

# Start the mock S3 service
infra.start_infra(asynchronous=True, apis=["s3"])
boto3.DEFAULT_SESSION = LocalS3Session()
s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

# The list of sites that we wish to crawl
NUM_BROWSERS = 3
sites = ['http://www.example.com',
         'http://www.princeton.edu',
         'http://citp.princeton.edu/']

# Loads the manager preference and 3 copies of the default browser dictionaries
manager_params, browser_params = TaskManager.load_default_params(NUM_BROWSERS)

# Update browser configuration (use this for per-browser settings)
for i in range(NUM_BROWSERS):
    # Record HTTP Requests and Responses
    browser_params[i]['http_instrument'] = True
    # Record cookie changes
    browser_params[i]['cookie_instrument'] = True
    # Record Navigations
    browser_params[i]['navigation_instrument'] = True
    # Record JS Web API calls
    browser_params[i]['js_instrument'] = True
    # Enable flash for all three browsers
    browser_params[i]['disable_flash'] = False
browser_params[0]['headless'] = True  # Launch only browser 0 headless

# Update TaskManager configuration (use this for crawl-wide settings)
manager_params['data_directory'] = '~/Desktop/'
manager_params['log_directory'] = '~/Desktop/'

# To save files in parquet format locally, we use the S3Aggregator in combination with the mock S3 service and download_s3_directory
manager_params['output_format'] = 's3'
manager_params['s3_bucket'] = local_s3_bucket(s3_resource)
manager_params['s3_directory'] = 'demo-local-parquet'

# Instantiates the measurement platform
# Commands time out by default after 60 seconds
manager = TaskManager.TaskManager(manager_params, browser_params)

# Visits the sites with all browsers simultaneously
for site in sites:
    command_sequence = CommandSequence.CommandSequence(site, reset=True)

    # Start by visiting the page
    command_sequence.get(sleep=3, timeout=60)

    # index='**' synchronizes visits between the three browsers
    manager.execute_command_sequence(command_sequence, index='**')

# Shuts down the browsers and waits for the data to finish logging
manager.close()

# Copy the resulting S3 contents to the local data dir
print("Copying the resulting S3 contents...")
root_dir = os.path.dirname(__file__)
destination = os.path.join(manager_params['data_directory'], 'crawl-data-parquet')
download_s3_directory(
    manager_params['s3_directory'],
    destination,
    manager_params['s3_bucket'])
print("Copied the resulting S3 contents to " + destination)

# Stop the mock S3 service
infra.stop_infra()
