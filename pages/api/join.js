import { Mailchain } from '@mailchain/sdk';

import { message } from '@/constants';

const secretRecoveryPhrase = process.env.NEXT_PUBLIC_MAILCHAIN_SECRET_KEY;

export default async function handler(req, res) {
	const { address } = req.body;
	const mailchain = Mailchain.fromSecretRecoveryPhrase(secretRecoveryPhrase);

	try {
		if (!address) res.status(400).json({ error: 'Address not found' });

		// Send Mail
		const { data, error } = await mailchain.sendMail({
			from: `0xBF4979305B43B0eB5Bb6a5C67ffB89408803d3e1@ethereum.mailchain.com`,
			to: [`${address}@ethereum.mailchain.com`],
			subject: 'Welcome to WAGMI Weekly!',
			content: {
				text: 'It’s official… We’re buddies now!',
				html: message,
			},
		});

		if (error) {
			res.status(500).json({ error: error });
		} else res.status(200).json({ data: data });
	} catch (error) {
		res.status(404).json({ error: error });
	}
}
