import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function Citizen() {
	const { id } = useParams();
	const navigate = useNavigate();

	return (
		<div className='p-6'>
			<Button variant='ghost' onClick={() => navigate(-1)}>
				<ArrowLeft /> К картотеке
			</Button>
			<h1 className='mt-4 text-xl font-semibold'>Карточка гражданина № {id}</h1>
			<p className='text-muted-foreground mt-2 text-sm'>
				Разделы карточки появятся в следующем шаге.
			</p>
		</div>
	);
}
