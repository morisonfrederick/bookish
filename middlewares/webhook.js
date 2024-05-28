


function verifyWebhook(req, res, next) {
    const paypalWebhookId = 'YOUR_WEBHOOK_ID';
    const transmissionId = req.headers['paypal-transmission-id'];
    const transmissionTime = req.headers['paypal-transmission-time'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];
    const transmissionSig = req.headers['paypal-transmission-sig'];
    const webhookEventBody = req.body;

    const expectedSignature = crypto.createHmac('sha256', paypalWebhookId)
        .update(transmissionId + '|' + transmissionTime + '|' + JSON.stringify(webhookEventBody), 'utf8')
        .digest('base64');

    if (expectedSignature === transmissionSig) {
        next();
    } else {
        res.status(400).send('Invalid webhook signature');
    }
}

module.exports = verifyWebhook
