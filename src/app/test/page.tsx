"use client"

import { Test } from '@/components/Test';

export default function Tests() {
    return (
        <div className='p-4 py-20 container mx-auto'>
            <div className='p-3 border border-primary rounded-box'>
                <h1 className="text-center text-info text-3xl">TEST</h1>
                <Test />
            </div>
        </div>
    );
}
