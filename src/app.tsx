import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Toaster } from './components/ui/sonner';
import Citizen from './pages/citizen';
import Home from './pages/home';
import Registry from './pages/registry';

import Layout from '@/components/layout/layout';

export default function App() {
	return (
		<BrowserRouter>
			<Toaster />
			<Routes>
				<Route element={<Layout />}>
					<Route element={<Home />} path={'/'} />
					<Route element={<Registry />} path={'/registry'} />
					<Route element={<Citizen />} path={'/registry/:id'} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
