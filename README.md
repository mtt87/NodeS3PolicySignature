# Generate AWS S3 policy signature with Node.js for client-side uploads
Generate temporary policy/signature to allow users to upload to S3 from the client-side where you can specify file limit or other type of rules.

##Instructions

###Create a user with S3 permission
 * Go into your `console.aws.amazon.com` and select `Identity and Access Management`(IAM)
 * Create a new user.  
 * Download or save your credentials.  
 * Save the **User ARN** we will need it later (ex `arn:aws:iam::xxxxxxxx:user/UserName`)
 * Attach a policy and select `AmazonS3FullAccess`


###Project credentials configuration
Create in the root `awsConfig.json` with these information:
```
{
    "secret": "awsSecret1234567890",
    "bucket":"your-bucket-name",
    "key":"awsKey"
}
```
Don't worry `awsConfig.json` it's already in `.gitignore`

###S3 Bucket settings
**Permission**
You need to add more permission and select "Everyone" and allow `List` and `Upload/Delete`

**Policy**
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "UploadFile",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::xxxxxxxx:user/UserName"
			},
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": "arn:aws:s3:::your-bucket-name/*"
		},
		{
			"Sid": "crossdomainAccess",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::your-bucket-name/crossdomain.xml"
		}
	]
}
```

**CORS configuration**
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```
##Deploy
I personally use [PM2](https://github.com/Unitech/pm2) to deploy

##TODO
 * Write about integration with Angular.js and `ng-file-upload`
