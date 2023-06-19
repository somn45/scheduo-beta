import { graphql } from '@/generates/type';
import { useQuery } from '@apollo/client';

const GET_USERS = graphql(`
  query GetUsers {
    allUsers {
      name
    }
  }
`);

export default function Home() {
  const { data, error } = useQuery(GET_USERS);
  console.log(data);
  return <div>Hello World!</div>;
}
