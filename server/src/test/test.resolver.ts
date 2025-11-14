import { Resolver,Query } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
    @Query(()=>String)
    Hello(){
        return 'First time calling from ther server'
    }
}
