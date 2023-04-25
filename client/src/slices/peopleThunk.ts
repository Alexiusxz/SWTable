import { getPeople, clearStore, setLoading } from './peopleSlice';
import { delLinks, setLinks } from './pagesSlice';
import { AppDispatch } from '../store/store'; 
import ky from 'ky';
import { IData, IOneMan } from '../Types/Types';

// функция получения первичных данных
export const getPeopleOnClick = (link: string | null = 'https://swapi.dev/api/people/') => (dispatch: AppDispatch) => { 
  dispatch(setLoading(true));
  ky.get(link ? link : 'https://swapi.dev/api/people/')
    .json<IData>()
    .then((data) => {
      const newData: IOneMan[] = data.results.map(({ name, height, mass, hair_color, skin_color }) => ({ name, height: isNaN(+height) ? height : +height, mass: isNaN(+mass) ? mass : +mass, hair_color, skin_color }));
      dispatch(getPeople(newData));
      dispatch(setLinks({ next: data.next, previous: data.previous }));
      localStorage.setItem('swapi', JSON.stringify(newData));
      localStorage.setItem('pages', JSON.stringify({ next: data.next, previous: data.previous }));
    })
    .catch(e => console.log(e))
    .finally(() => dispatch(setLoading(false)));
};

//функция очистки таблицы
export const clearTable = () => (dispatch: AppDispatch) => {
  dispatch(clearStore());
  dispatch(delLinks())
  localStorage.removeItem('swapi');
  localStorage.removeItem('rowHeights');
  localStorage.removeItem('colWidths');
  localStorage.removeItem('pages');
};