/* Mirror the two write-only GL states used by our nested passes. Both native
 * writers (ogl.c and gr.c) route here; values start at the OpenGL defaults.
 * Queries used to force a CPU/GPU round trip for every shadow receiver. */
static GLboolean astra_depth_write=GL_TRUE;
static GLfloat astra_clear_value[4]={0,0,0,0};
static GLenum astra_blend_source=GL_ONE,astra_blend_dest=GL_ZERO;
static GLfloat astra_blend_value[4]={0,0,0,0};
void astra_blend_func(GLenum source,GLenum dest)
{
    astra_blend_source=source;astra_blend_dest=dest;glBlendFunc(source,dest);
}
static void astra_blend_color(GLclampf r,GLclampf g,GLclampf b,GLclampf a)
{
    const GLfloat value[]={r,g,b,a};
    for(int i=0;i<4;i++)astra_blend_value[i]=value[i]<0?0:value[i]>1?1:value[i];
    glBlendColor(r,g,b,a);
}
static void astra_depth_mask(GLboolean write)
{
    astra_depth_write=write?GL_TRUE:GL_FALSE;glDepthMask(write);
}
void astra_clear_color(GLclampf r,GLclampf g,GLclampf b,GLclampf a)
{
    const GLfloat value[]={r,g,b,a};
    for(int i=0;i<4;i++)astra_clear_value[i]=value[i]<0?0:value[i]>1?1:value[i];
    glClearColor(r,g,b,a);
}
#define glDepthMask astra_depth_mask
#define glClearColor astra_clear_color
#define glBlendFunc astra_blend_func
#define glBlendColor astra_blend_color

/* R56: bounded native uniform cache avoids repeated WASM/JS string conversion
 * and WebGL name parsing. No uniform values or render state are cached here.
 * All lookups use string contents, including names built in stack buffers. */
#define ASTRA_UNIFORM_SLOTS 2048
typedef struct {
    GLuint program;
    GLint location;
    unsigned int hash;
    char name[64];
} astra_uniform_entry;
static astra_uniform_entry astra_uniform_cache[ASTRA_UNIFORM_SLOTS];
static GLint astra_uniform_location(GLuint program,const char *name)
{
    if(!program||!name)return glGetUniformLocation(program,name);
    unsigned int hash=2166136261u^program;size_t length=0;
    while(name[length]){
        if(length>=sizeof(astra_uniform_cache[0].name)-1)return glGetUniformLocation(program,name);
        hash=(hash^(unsigned char)name[length++])*16777619u;
    }
    unsigned int slot=hash&(ASTRA_UNIFORM_SLOTS-1);
    for(unsigned int i=0;i<16;i++,slot=(slot+1)&(ASTRA_UNIFORM_SLOTS-1)){
        astra_uniform_entry *entry=&astra_uniform_cache[slot];
        if(!entry->program){
            GLint location=glGetUniformLocation(program,name);
            if(location>=0){entry->program=program;entry->hash=hash;entry->location=location;memcpy(entry->name,name,length+1);}
            return location;
        }
        if(entry->program==program&&entry->hash==hash&&!strcmp(entry->name,name))return entry->location;
    }
    return glGetUniformLocation(program,name);
}
static void astra_uniform_link(GLuint program)
{
    memset(astra_uniform_cache,0,sizeof(astra_uniform_cache));glLinkProgram(program);
}
static void astra_uniform_delete(GLuint program)
{
    memset(astra_uniform_cache,0,sizeof(astra_uniform_cache));glDeleteProgram(program);
}
#define glGetUniformLocation astra_uniform_location
#define glLinkProgram astra_uniform_link
#define glDeleteProgram astra_uniform_delete
