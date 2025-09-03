export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Страница не найдена
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          У вас нет доступа к этой странице
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Войти в систему
        </a>
      </div>
    </div>
  );
}
