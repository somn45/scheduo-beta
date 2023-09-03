import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/api/graphql',
  documents: ['./**/*.tsx', './utils/graphQL/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  watch: true,
  generates: {
    'generates/type/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
    },
  },
};

export default config;
