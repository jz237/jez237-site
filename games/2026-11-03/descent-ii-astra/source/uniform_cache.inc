#ifndef ASTRA_UNIFORM_CACHE
#define ASTRA_UNIFORM_CACHE
/* R65: constant-name uniform locations are resolved once per program.
 * Four entries cover shared binding sites; static engine programs never relink.
 * No WebGL query, name hashing or linear global-cache scan in the warm path. */
typedef struct {GLuint program[4];GLint location[4];} as_uniform_site;
static unsigned as_uniform_misses;
static GLint as_uniform_find(as_uniform_site *s,GLuint p,const char *name){
    unsigned i=p&3u;if(s->program[i]==p)return s->location[i];
    for(unsigned j=0;j<4;j++)if(s->program[j]==p)return s->location[j];
    for(unsigned j=0;j<4;j++)if(!s->program[j]){i=j;break;}
    s->program[i]=p;s->location[i]=glGetUniformLocation(p,name);as_uniform_misses++;return s->location[i];
}
#define AS_UNIFORM(program,name) ({static as_uniform_site cache;as_uniform_find(&cache,(program),(name));})
#endif
