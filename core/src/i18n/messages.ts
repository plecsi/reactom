import { defineMessages } from 'react-intl';

export const scope = 'default';

export default defineMessages({
  welcome: {
    id: `${scope}.welcome`,
    defaultMessage: 'welcome',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
});
