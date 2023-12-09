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
        <div className="mb-2 pb-2 border border-accent rounded-box">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text text-xl">Rock Pepar Scissors</span>
                </div>
                <select className="select select-bordered" value={userHand} onChange={handleSelectChange}>
                    <option value="None">None</option>
                    <option value="Rock">Rock</option>
                    <option value="Paper">Paper</option>
                    <option value="Scissors">Scissors</option>
                </select>
                <div className="label">
                    <span className={`label-text text-7xl ${userHand === 'Rock' ? 'bg-primary' : ''}`}>
                        <input
                            type="checkbox"
                            value="Rock"
                            onChange={() => handleCheckboxChange('Rock')}
                            checked={userHand === 'Rock'}
                            className="checkbox absolute opacity-0 w-20 h-20"
                        />
                        ✊
                    </span>
                    <span className={`label-text text-7xl ${userHand === 'Paper' ? 'bg-success' : ''}`}>
                        <input
                            type="checkbox"
                            value="Paper"
                            onChange={() => handleCheckboxChange('Paper')}
                            checked={userHand === 'Paper'}
                            className="checkbox absolute opacity-0 w-20 h-20"
                        />
                        🖐️
                    </span>
                    <span className={`label-text text-7xl ${userHand === 'Scissors' ? 'bg-warning' : ''}`}>
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
            </label>
        </div>
    );
}
