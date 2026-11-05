/* D2's original articulated limbs, wings, muzzle locations and outer hull
   panels define the vehicle. Machinery fills the gaps between those panels. */
int astra_shell,astra_limb;
vms_vector astra_shell_center,astra_shell_extents;
static vms_vector astra_local_points[4096];
static int astra_keep_panel(unsigned char *p,int count){
    if(!astra_shell||astra_limb)return 1;
    float sum[3]={0,0,0};
    for(int i=0;i<count;i++){int id=wp(p+30)[i];if(id<0||id>=4096)return 1;
        const vms_vector *v=&astra_local_points[id];sum[0]+=v->x;sum[1]+=v->y;sum[2]+=v->z;}
    float x=(sum[0]/count-astra_shell_center.x)/fmaxf(1,astra_shell_extents.x);
    float y=(sum[1]/count-astra_shell_center.y)/fmaxf(1,astra_shell_extents.y);
    float z=(sum[2]/count-astra_shell_center.z)/fmaxf(1,astra_shell_extents.z);
    extern float astra_panel_damage(void);float damage=astra_panel_damage();
    /* Selected outer plates are lost only after heavy damage. Native hitboxes
     * remain unchanged; the detailed inner chassis is visible underneath. */
    if(damage>.6f&&sinf(x*23+y*17+z*31)>.85f-(damage-.6f))return 0;
    return fabsf(x)>.70f || y>.69f || (y<-.64f&&z>.12f) || (z<-.79f&&fabsf(x)>.24f);
}

