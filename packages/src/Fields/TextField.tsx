import { Input } from '@react/Input';

export default function TextField() {
  return (
    <div className="fields">
      <p>itt lesz majd a name</p>
      <Input
        name={'valami'}
        type={'text'}
        placeholder="Enter text here"
        value={''}
      />
    </div>
  );
}
