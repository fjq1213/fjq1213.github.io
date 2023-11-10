# Notes

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
