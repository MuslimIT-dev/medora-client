import { useEffect, useState, useMemo } from 'react';

export default function List({ filters, Card, getList }) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getList(page, perPage, filters);
        if (!cancelled) {
          const items = result.data || result.Data || [];
          const totalItems = result.totalCount || result.TotalCount || 0;
          setList(items);
          setTotal(totalItems);
        }
      } catch (err) {
        console.error(err);
        setList([]);
        setTotal(0);
      }
    })();
    return () => { cancelled = true; };
  }, [filters, page, getList]);

  const maxPage = useMemo(() => {
    const count = Number(total) || 0;
    return count > 0 ? Math.ceil(count / perPage) : 1;
  }, [total, perPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const PaginationUI = () => (
    <div className="flex gap-3 justify-center items-center py-4">
      <button
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:bg-gray-50 transition-colors hover:bg-gray-50"
        onClick={() => handlePageChange(Math.max(page - 1, 1))}
        disabled={page <= 1}
      >
        Назад
      </button>
      <span className="px-2 text-sm font-medium">
        Страница {page} из {maxPage}
      </span>
      <button
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:bg-gray-50 transition-colors hover:bg-gray-50"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= maxPage}
      >
        Вперёд
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {total > perPage && <PaginationUI />}

      <div className="flex flex-col gap-4 min-h-[400px]">
        {list.length > 0 ? (
          list.map((objData) => (
            <Card key={objData.id} Data={objData} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">
            Загрузка или данных нет...
          </div>
        )}
      </div>

      {total > perPage && <PaginationUI />}
    </div>
  );
}
