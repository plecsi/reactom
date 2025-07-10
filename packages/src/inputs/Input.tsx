import { TextInput } from './types';
import styles from './Input.module.scss';

export function Input(props: TextInput) {
  const { name = '', type = 'text', value, readonly, ...rest } = props;

  if (readonly) {
    return <p>{value}</p>;
  }

  return (
    <input
      type={type}
      name={name}
      id="valami"
      className={styles.input}
      placeholder="valami lesz majd"
      {...rest}
    />
  );
}

export default Input;
