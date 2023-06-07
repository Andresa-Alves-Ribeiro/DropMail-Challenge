import { ApolloClient, gql, InMemoryCache, useQuery } from "@apollo/client";

const AUTH_TOKEN = "andresaalvestoken";
const CORS = "https://cors-anywhere.herokuapp.com/";

const client = new ApolloClient({
  uri: `${CORS}https://dropmail.me/api/graphql/${AUTH_TOKEN}`,
  fetchOptions: {
    mode: "cors",
  },
  headers: {
    ContentType: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  cache: new InMemoryCache(),
});

export const GENERATE_EMAIL = gql`
	mutation {
		introduceSession {
			id
			expiresAt
			addresses {
				address
			}
		}
	}
`;

export const LOOK_EMAIL = gql`
  query {
    session(id: "${sessionStorage.getItem("@SESSION_ID")}") {
      mails {
        rawSize,
        fromAddr,
        toAddr,
        downloadUrl,
        text,
        headerSubject
      }
    }
  }
`;

export function useCheckEmailQuery() {
  const LOOK_EMAIL = gql`
    query {
      session(id: "${sessionStorage.getItem("@SESSION_ID")}") {
        mails {
          rawSize,
          fromAddr,
          toAddr,
          downloadUrl,
          text,
          headerSubject
        }
      }
    }
  `;

  const { data, errors } = useQuery(LOOK_EMAIL);

  return { data, errors };
}

export default client;
