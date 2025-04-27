const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;

    return (
        <div className="absolute right-0 top-0 flex items-center h-full pr-3">
            <div className="bg-red-100 text-red-700 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                {error}
            </div>
        </div>
    );
};

export default ErrorMessage;
