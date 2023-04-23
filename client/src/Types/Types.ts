export interface IData {
  count: number;
  next: string | null;
  previous: string | null;
  results: IOneManData[];
}
export interface IOneManData {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface IPeople {
  people: IOneMan[];
}


export interface IOneMan {
    name: string;
    height: number | string;
    mass: number | string;
    hair_color: string;
    skin_color: string;
}

export interface IPage {
  next: string | null;
  previous: string | null;
}
