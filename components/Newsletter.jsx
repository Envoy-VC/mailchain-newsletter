import * as React from 'react';
import Image from 'next/image';

import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';

import {
	hygraph,
	CHECK_WALLET,
	CREATE_SUBSCRIBER,
	PUBLISH_SUBSCRIBER,
} from '@/utils/query';

import newsletter from '../assets/newsletter.png';

const Newsletter = () => {
	const recoveredAddress = React.useRef('');
	const [loading, setLoading] = React.useState(false);

	const { signMessage } = useSignMessage({
		message: 'Sign this message to subscribe to WAGMI Weekly',
		onSuccess(data, variables) {
			const address = verifyMessage(variables.message, data);
			recoveredAddress.current = address;
			joinNewsletter(recoveredAddress.current);
		},
		onError() {
			setLoading(false);
			// user rejected signature
		},
	});

	const isSubscribed = async (address) => {
		const query = CHECK_WALLET(address);
		const id = await hygraph.request(query);
		if (id.subscribers[0] === undefined) return false;
		else if (id.subscribers[0].id) return true;
	};

	const createSubscriber = async (address) => {
		const subscriberId = await hygraph.request(CREATE_SUBSCRIBER(address));
		const published = await hygraph.request(PUBLISH_SUBSCRIBER(address));
		return published.publishSubscriber.id;
	};

	const joinNewsletter = async (userAddress) => {
		try {
			const existingSubscriber = await isSubscribed(userAddress);
			if (!existingSubscriber) {
				const id = await createSubscriber(userAddress);
				const response = await fetch('/api/join', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ address: userAddress }),
				});
				const data = await response.json();
				if (data.savedMessageId) console.log('Subscribed successfully');
			} else {
				console.log('Already subscribed');
				throw new Error('Already subscribed');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className='my-8 text-black'>
			<div className='container flex flex-col items-center p-4 mx-auto space-y-6 md:p-8'>
				<Image src={newsletter} alt='newsletter' width={96} height={96} />
				<p className='px-6 py-2 text-2xl text-gray-700 text-center font-bold sm:text-3xl md:text-4xl lg:max-w-2xl xl:max-w-4xl font-rubik'>
					&quot;Bored of FOMO? Join WAGMI Weekly and never miss a crypto beat
					again! Get your weekly dose of fun, laughter, and expert analysis on
					all things Web3!&quot;
				</p>
				<button
					className='text-xl text-gray-100  font-sans font-extrabold border-2 py-4 px-8 rounded-3xl semi-transparent-btn transition-all ease-in-out duration-700'
					onClick={() => {
						setLoading(true);
						signMessage();
					}}
					disabled={loading}
				>
					{loading ? 'Subscribing...' : 'Join Now'}
				</button>
			</div>
		</section>
	);
};

export default Newsletter;
