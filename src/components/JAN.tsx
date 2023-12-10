import React from 'react';

interface JANProps {
    userHand?: string;
    onUserHandChange: (newHand: string) => void;
}

export const JAN = ({ userHand, onUserHandChange }: JANProps) => {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newHand = event.target.value;
        onUserHandChange(newHand);
    };

    const handleCheckboxChange = (hand: string) => {
        onUserHandChange(hand);
    };

    return (
        <div className="p-3 border-2 border-accent rounded-box w-max-xs">
            <label className="form-control">
                <div className="label">
                    <span className="label-text text-xl mx-auto">Rock Pepar Scissors</span>
                </div>
                <div className="label">
                    <span className={`label-text text-7xl hover:bg-primary ${userHand === 'Rock' ? 'bg-primary animate-none' : 'animate-pulse'}`}>
                        <input
                            type="checkbox"
                            value="Rock"
                            onChange={() => handleCheckboxChange('Rock')}
                            checked={userHand === 'Rock'}
                            className="checkbox absolute opacity-0 w-20 h-20"
                        />
                        ✊
                    </span>
                    <span className={`label-text text-7xl hover:bg-success ${userHand === 'Paper' ? 'bg-success animate-none' : 'animate-pulse'}`}>
                        <input
                            type="checkbox"
                            value="Paper"
                            onChange={() => handleCheckboxChange('Paper')}
                            checked={userHand === 'Paper'}
                            className="checkbox absolute opacity-0 w-20 h-20"
                        />
                        🖐️
                    </span>
                    <span className={`label-text text-7xl hover:bg-warning ${userHand === 'Scissors' ? 'bg-warning animate-none' : 'animate-pulse'}`}>
                        <input
                            type="checkbox"
                            value="Scissors"
                            onChange={() => handleCheckboxChange('Scissors')}
                            checked={userHand === 'Scissors'}
                            className="checkbox absolute opacity-0 w-20 h-20"
                        />
                        ✌️
                    </span>
                </div>
                <select className="select select-bordered" value={userHand} onChange={handleSelectChange}>
                    <option value="None">None</option>
                    <option value="Rock">Rock</option>
                    <option value="Paper">Paper</option>
                    <option value="Scissors">Scissors</option>
                </select>
            </label>
        </div>
    );
}
