/* Mirror the two write-only GL states used by our nested passes. Both native
 * writers (ogl.c and gr.c) route here; values start at the OpenGL defaults.
 * Queries used to force a CPU/GPU round trip for every shadow receiver. */
static GLboolean astra_depth_write=GL_TRUE;
static GLfloat astra_clear_value[4]={0,0,0,0};
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
