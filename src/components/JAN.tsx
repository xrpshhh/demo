
interface JANProps {
    userHand?: string;
    onUserHandChange: (newHand: string) => void;
}

export const JAN = ({ userHand, onUserHandChange }: JANProps) => {
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newHand = event.target.value;
        onUserHandChange(newHand);
    };

    return (
        <div className="mb-2 pb-4 border border-accent rounded-box">
            <h2 className="text-xl font-bold mb-3">Rock Paper Scissors</h2>

            <label className="hover:primary text-6xl py-2 px-2 rounded">
                <input
                    type="checkbox"
                    value="rock"
                    // value="0"
                    onChange={handleOptionChange}
                    checked={userHand === 'rock'}
                    className="checkbox absolute opacity-0 w-0 h-0"
                />
                <span className={`hover:bg-primary ${userHand === 'rock' ? 'bg-primary' : ''}`}>
                    ✊
                </span>
            </label>
            <label className="hover:bg-success text-6xl py-2 px-2 rounded">
                <input
                    type="checkbox"
                    value="paper"
                    // value="1"
                    onChange={handleOptionChange}
                    checked={userHand === 'paper'}
                    className="checkbox absolute opacity-0 w-0 h-0"
                />

                <span className={`hover:bg-success ${userHand === 'paper' ? 'bg-success' : ''}`}>
                    🖐️
                </span>
            </label>
            <label className="hover:bg-warning text-6xl py-2 px-2 rounded">
                <input
                    type="checkbox"
                    value="scissors"
                    // value="2"
                    onChange={handleOptionChange}
                    checked={userHand === 'scissors'}
                    className="checkbox absolute opacity-0 w-0 h-0"
                />
                <span className={`hover:bg-warning ${userHand === 'scissors' ? 'bg-warning' : ''}`}>
                    ✌️
                </span>
            </label>
        </div>
    );
}
