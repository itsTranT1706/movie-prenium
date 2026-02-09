
export class MovieCastDTO {
    id: number;
    name: string;
    originalName: string;
    character: string;
    profileUrl: string | null;
    order: number;

    constructor(props: MovieCastDTO) {
        Object.assign(this, props);
    }
}
