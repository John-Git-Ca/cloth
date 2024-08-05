import React from 'react';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

const Paginate = ({ pages, page, isAdmin = false, keyword = 'all' }) => {
  const pagesNumber = Number(pages);
  const pageNumber = Number(page);
  return (
    pagesNumber >= 1 && (
      <Pagination className="m-2 justify-content-center">
        {pageNumber > 1 && (
          <Link
            href={
              !isAdmin
                ? keyword
                  ? `/page/${keyword}/1`
                  : `/page/all/1`
                : `/admin/productlist/1`
            }
            passHref
            legacyBehavior
          >
            <Pagination.First />
          </Link>
        )}
        {pageNumber > 1 && (
          <Link
            href={
              !isAdmin
                ? keyword
                  ? `/page/${keyword}/${pageNumber - 1}`
                  : `/page/all/${pageNumber - 1}`
                : `/admin/productlist/${pageNumber - 1}`
            }
            passHref
            legacyBehavior
          >
            <Pagination.Prev />
          </Link>
        )}
        {pageNumber > 1 && <Pagination.Ellipsis disabled />}
        <Link
          href={
            !isAdmin
              ? keyword
                ? `/page/${keyword}/${pageNumber}`
                : `/page/all/${pageNumber}`
              : `/admin/productlist/${pageNumber}`
          }
          passHref
          legacyBehavior
        >
          <Pagination.Item active className="p-0">
            {pageNumber}
          </Pagination.Item>
        </Link>
        {pagesNumber > page && <Pagination.Ellipsis disabled />}
        {pagesNumber > page && (
          <Link
            href={
              !isAdmin
                ? keyword
                  ? `/page/${keyword}/${pageNumber + 1}`
                  : `/page/all/${pageNumber + 1}`
                : `/admin/productlist/${pageNumber + 1}`
            }
            passHref
            legacyBehavior
          >
            <Pagination.Next />
          </Link>
        )}
        {pagesNumber > page && (
          <Link
            href={
              !isAdmin
                ? keyword
                  ? `/page/${keyword}/${pagesNumber}`
                  : `/page/all/${pagesNumber}`
                : `/admin/productlist/${pagesNumber}`
            }
            passHref
            legacyBehavior
          >
            <Pagination.Last />
          </Link>
        )}
      </Pagination>
    )
  );
};

export default Paginate;

// import React from 'react';
// import { Pagination } from 'react-bootstrap';
// import Link from 'next/link';

// const Paginate = ({ pages, page, isAdmin = false, keyword = 'all' }) => {
//   return (
//     pages > 1 && (
//       <Pagination className="m-2 justify-content-center" size="sm">
//         {[...Array(pages).keys()].map((x) => (
//           <Link
//             key={x + 1}
//             href={
//               !isAdmin
//                 ? keyword
//                   ? `/page/${keyword}/${x + 1}`
//                   : `/page/all/${x + 1}`
//                 : `/admin/productlist/${x + 1}`
//             }
//             passHref
//           >
//             <Pagination.Item active={x + 1 === Number(page)}>
//               {x + 1}
//             </Pagination.Item>
//           </Link>
//         ))}
//       </Pagination>
//     )
//   );
// };

// export default Paginate;
