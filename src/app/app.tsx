import { Modules } from '@react/modules';
import { FormBuilder, Form } from '@react/Input';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LanguageSelector, DefaultMessages as messages} from '@react/core';
import { FormattedMessage } from 'react-intl';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'userProfile/fetch' });
    console.log('Kecske');
  }, [dispatch]);

  return (
    <div>
      <LanguageSelector />

      <FormattedMessage id={messages.welcome.id} defaultMessage={messages.welcome.defaultMessage} />
      <Form />
      <Modules />
      <FormBuilder />
    </div>
  );
}

export default App;
