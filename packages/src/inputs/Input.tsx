import { TextInput } from './types';
import styles from './Input.module.scss';

export function Input(props: TextInput) {
  const { id, name = '', type = 'text', value, readonly, ...rest } = props;

  if (readonly) {
    return <p>{value}</p>;
  }

  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value || ''}
      className={styles.input}
      placeholder="valami lesz majd"
      {...rest}
    />
  );
}

export default Input;
