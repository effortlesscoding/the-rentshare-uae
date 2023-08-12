# https://stackoverflow.com/questions/5123208/upload-folder-with-subfolders-using-s3-and-the-aws-console
aws s3 cp ./build s3://vitamin-c/ --recursive
