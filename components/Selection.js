import Link from 'next/link';

const Selection = ({ active, content, target }) => {
  return (
    <Link href={target}>
      <a
        className={
          active
            ? 'd-inline-block rounded p-1 text-center green_border bg-dark text-light'
            : 'd-inline-block rounded p-1 text-center border'
        }
        style={{ minWidth: '50px' }}
      >
        {content}
      </a>
    </Link>
  );
};

export default Selection;
