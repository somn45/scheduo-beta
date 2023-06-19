import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/api/graphql',
  documents: ['pages/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    'generates/type/': {
      preset: 'client',
    },
  },
};

export default config;
