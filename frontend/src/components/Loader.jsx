export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="h-14 w-14 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-textMuted mt-4">Generating quiz, please wait...</p>
        </div>
    );
}
