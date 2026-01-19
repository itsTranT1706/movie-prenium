import { BaseEntity } from '@/shared/domain';

export interface FavoriteProps {
    userId: string;
    movieId: string;
    createdAt: Date;
}

export class Favorite extends BaseEntity<string> {
    private props: FavoriteProps;

    private constructor(id: string, props: FavoriteProps) {
        super(id);
        this.props = props;
    }

    get userId(): string {
        return this.props.userId;
    }

    get movieId(): string {
        return this.props.movieId;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    public static create(id: string, props: FavoriteProps): Favorite {
        return new Favorite(id, props);
    }
}
