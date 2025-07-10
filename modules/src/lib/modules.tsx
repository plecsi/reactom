import styles from './modules.module.scss';
import { Fields } from '@react/Input';

export function Modules() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Modules!</h1>
      <form>
        <Fields />
      </form>
    </div>
  );
}

export default Modules;
