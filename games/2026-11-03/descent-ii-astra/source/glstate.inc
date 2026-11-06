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
