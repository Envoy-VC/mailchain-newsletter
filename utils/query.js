import { GraphQLClient, gql } from 'graphql-request';

export const hygraph = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_URL);

export const CHECK_WALLET = (address) => {
	const query = gql`
		{
			subscribers(where: { address: "${address}" }) {
                id
            }
		}
	`;
	return query;
};

export const CREATE_SUBSCRIBER = (address) => {
	const query = gql`
		mutation CreateSubscriber {
			createSubscriber(
				data: { address: "${address}"}) {
				id
			}
		}
	`;
	return query;
};

export const PUBLISH_SUBSCRIBER = (address) => {
	const query = gql`
		mutation PublishSubscriber {
			publishSubscriber(
				where: { address: "${address}"}) {
				id
			}
		}
	`;
	return query;
};
