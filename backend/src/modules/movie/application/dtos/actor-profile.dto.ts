import { Movie } from '../../domain';

export class ActorProfileDTO {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    placeOfBirth: string | null;
    profileUrl: string | null;
    knownForDepartment: string;
    movies: Movie[];

    constructor(props: ActorProfileDTO) {
        Object.assign(this, props);
    }
}
