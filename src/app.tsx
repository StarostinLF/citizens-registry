import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout';
import Citizen from './pages/citizen';
import Home from './pages/home';
import Registry from './pages/registry';

export default function App() {
	return (
		<BrowserRouter>
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
