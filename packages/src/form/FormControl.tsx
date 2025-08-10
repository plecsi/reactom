import styles from './index.module.scss'

type FormControlProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

export const FormControl = ({ label, htmlFor, children }: FormControlProps) => (
  <div className="formControl">
    <label htmlFor={htmlFor} className={styles.label}>{label}</label>
    <div className="adormentwrapper">
      <div className="icon"></div>
      {children}
    </div>
  </div>
);