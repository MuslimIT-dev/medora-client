import React from 'react';
import List from '../../../widgets/List.js';
import MedcardCard from '../../../dummies/MedcardCard.js';
import { getMedcardData } from '../../../../api/medcard.js';

export default function Allergies() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">🌿 Аллергические реакции</h1>
            <List 
                getList={(page, count) => getMedcardData('allergies', page, count)} 
                Card={MedcardCard} 
                filters={{}} 
            />
        </div>
    );
}
