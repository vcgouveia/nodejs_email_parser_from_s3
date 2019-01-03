var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var simpleParser = require('mailparser').simpleParser;
 
var bucketName = '<BUCKET_NAME>';

exports.handler = function(event, context, callback) {
    console.log('Process email');
    
    var sesNotification = event.Records[0].ses;
    console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));
    
    // Retrieve the email from your bucket
    s3.getObject({
            Bucket: bucketName,
            Key: sesNotification.mail.messageId
        }, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            } else {
                console.log("Raw email:\n" + data.Body);
                
                // Custom email processing goes here
                simpleParser(data.Body, (err, parsed) => {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
                        console.log("date:", parsed.date);
                        console.log("subject:", parsed.subject);
                        console.log("body:", parsed.text);
                        console.log("from:", parsed.from.text);
                        console.log("attachments:", parsed.attachments);
                        callback(null, null);
                    }
                });
            }
        });
};
