interface SpinnerProps {
    loading: boolean,
}

function Spinner({ loading }: SpinnerProps) {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 grid place-items-center backdrop-blur-xs">
            <img src="spinner.svg" alt="loading spinner" height="5vw" width="5vw" className="size-15" />
        </div>
    );
}

export default Spinner;