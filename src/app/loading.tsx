export default function loading() {
    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            <h2 className="text-center text-2xl animate-pulse">読み込み中...</h2>
            <div className="flex justify-center items-center">
                <span className="loading loading-infinity loading-lg"></span>
                <span className="loading loading-infinity loading-lg"></span>
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        </div>
    )
}
