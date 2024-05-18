# Notes

<div class="container">
    <section 
    <div class="search-box">
        <input type="text" placeholder="Seach here..." id="inp-word"/>
        <button id="search-btn">Search</button>
    </div>
    <div class="result" id="result">
        
    </div>
</div>

### Cache
- cache info: `/sys/devices/system/cpu/cpu0/cache`
- hugepage info: `sysctl vm.nr_hugepages` or `cat /proc/sys/vm/nr_hugepages`
- hugepage utility: `cat /proc/meminfo | grep -i huge`

Test Data on Neoverse-N2:
- access (pid 0) - acess (pid 0) - huge: 20ns, should be L1 cache latency
- access (pid 0) - visit (pid 1) - access (pid 0) - huge: 30ns(?)
- flush (pid 0) - access (pid 0) - huge: 400ns, should be memory latency
- flush (pid 0) - access (pid 1) - access (pid 0) - normal page: 50ns, should be L2 cache latency
- flush (cpu 0) - access (cpu 1) - access (cpu 0) - normal page: 130ns, should be L3 cache latency

### QEMU

#### ivshmem

```xml
<shmem name='shmem0'>
  <model type='ivshmem-plain'/>
  <size unit='M'>8</size>
  <address type='pci' domain='0x0000' bus='0x06' slot='0x01' function='0x0'/>
</shmem>
```

access: 
- host: `shm_open("shmem0", O_RDWR, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP)`
- guest: `open("/sys/bus/pci/devices/{dev_num}/resource2", O_RDWR)`

#### virtiofs

```xml
<domain>
  ...
  <memoryBacking>
    <source type='memfd'/>
    <access mode='shared'/>
  </memoryBacking>
  ...
  <devices>
    ...
    <filesystem type='mount' accessmode='passthrough'>
      <driver type='virtiofs' queue='1024'/>
      <source dir='/path'/>
      <target dir='mount_tag'/>
    </filesystem>
    ...
  </devices>
</domain>
```
guest: `mount -t virtiofs mount_tag /mnt/mount/path`

### PocGen
- classification: [A Systematic Evaluation of Transient Execution Attacks and Defenses](https://arxiv.org/pdf/1811.05441.pdf)
- [处理器分支预测攻击研究综述](http://cjc.ict.ac.cn/online/onlinepaper/lc-20221215211059.pdf)
- [Survey of Transient Execution Attacks and Their Mitigations](https://dl.acm.org/doi/pdf/10.1145/3442479)
- Spectre V1: [Spectre Attacks: Exploiting Speculative Execution](https://spectreattack.com/spectre.pdf)
- [NetSpectre](https://martinschwarzl.at/media/files/netspectre.pdf)
- Spectre V1.1: [Speculative Buffer Overflows: Attacks and Defenses](https://people.csail.mit.edu/vlk/spectre11.pdf)
- RSC(Residual State Based Covert Channel): [Covert Channels Through Branch Predictors: A Feasibility Study](https://www.cs.wm.edu/~dmitry/assets/files/evtyushkin-hasp15.pdf)
- RSC+CC: [Understanding and Mitigating Covert Channels Through Branch Predictors](http://www.cs.ucr.edu/~nael/pubs/taco16_branches.pdf)
- CC(Contention-Based Covert Channels): [Understanding Contention-Based Channels and Using Them for Defense](https://users.ece.utexas.edu/~tiwari/pubs/HPCA-15-contention.pdf)
- [Spectre Side Channels](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html)

### GCC's assembler syntax
- =& means that the output is an early-clobber output. Its initial value is unspecified. It is not a bug to read from an =& operand once it has been assigned a value.
- = means that the output is write-only. The compiler can choose to give an = output the same location as an input: for that reason, it is usually a bug to ***write to it before the last instruction*** of your assembly snippet.
