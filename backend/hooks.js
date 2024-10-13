// hooks.js

// Import necessary modules
import { MailerMessage } from "pocketbase"; // Adjust this import based on your actual setup

// Hook for sending an email after a new user is created
onRecordAfterCreateRequest((e) => {
    const message = new MailerMessage({
        from: {
            address: $app.settings().meta.senderAddress,  // Replace with your sender's address
            name:    $app.settings().meta.senderName,     // Replace with your sender's name
        },
        to:      [{ address: e.record.email() }], // The email address of the newly created user
        subject: "Welcome to Our Service!", // Customize the subject line
        html:    "<h1>Welcome!</h1><p>Thank you for joining us!</p>", // Customize the email body
    });

    // Send the email
    $app.newMailClient().send(message)
        .then(() => {
            console.log(`Email sent successfully to ${e.record.email()}`);
        })
        .catch((error) => {
            console.error(`Failed to send email: ${error.message}`);
        });
}, "users");
