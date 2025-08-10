// core/src/i18n/__tests__/LanguageProvider.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { LanguageProvider, useLanguage } from '../LanguageProvider';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { locale, translations, setLocale, loading } = useLanguage();

//  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="submit">{translations['admin.form.submit']}</div>
      <button onClick={() => setLocale('hu')}>Change to HU</button>
    </div>
  );
};

describe('LanguageProvider', () => {
  test('loads default locale and translations, changes locale', async () => {
    render(
      <Provider store={store}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'));
    expect(screen.getByTestId('submit')).toHaveTextContent('Submit');

    userEvent.click(screen.getByText('Change to HU'));

    await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('hu'));
    expect(screen.getByTestId('submit')).toHaveTextContent('Küldés');
  });
});
