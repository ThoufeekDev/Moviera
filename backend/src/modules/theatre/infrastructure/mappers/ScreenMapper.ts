import { Screen } from "../../domain/entities/screen.entity";
import type { ScreenProps } from "../../domain/types/ScreenProps";


export class ScreenMapper {
    static toDomain(data: ScreenProps): Screen{
        return Screen.restore(data)
    }
}