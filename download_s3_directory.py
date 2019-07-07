import os
import boto3


def download_s3_directory(dir, destination='/tmp', bucket='your_bucket'):
    client = boto3.client('s3')
    resource = boto3.resource('s3')
    paginator = client.get_paginator('list_objects')
    for result in paginator.paginate(Bucket=bucket, Delimiter='/', Prefix=dir):
        if result.get('CommonPrefixes') is not None:
            for subdir in result.get('CommonPrefixes'):
                download_s3_directory(
                    subdir.get('Prefix'), destination, bucket)
        for file in result.get('Contents', []):
            dest_pathname = os.path.join(destination, file.get('Key'))
            if not os.path.exists(os.path.dirname(dest_pathname)):
                os.makedirs(os.path.dirname(dest_pathname))
            resource.meta.client.download_file(
                bucket, file.get('Key'), dest_pathname)
