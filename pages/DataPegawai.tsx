import React, { useState, useMemo, useRef } from 'react';
import { employees } from '../data/mockData';
import { Employee } from '../types';
import { SearchIcon, PlusIcon, DownloadIcon, ArrowUpTrayIcon, PencilIcon, TrashIcon } from '../constants';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import Modal from '../components/Modal';

const DataPegawai: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(employeeList.map(e => e.department));
    return Array.from(depts);
  }, [employeeList]);

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(employee => {
      const searchMatch = (
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const departmentMatch = !departmentFilter || employee.department === departmentFilter;
      const statusMatch = !statusFilter || employee.status === statusFilter;
      
      return searchMatch && departmentMatch && statusMatch;
    });
  }, [searchTerm, employeeList, departmentFilter, statusFilter]);
  
  const getStatusClass = (status: 'Aktif' | 'Tidak Aktif') => {
    return status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };
  
  const handleOpenDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'avatarUrl'>) => {
    const newId = (Math.max(...employeeList.map(e => parseInt(e.id))) + 1).toString();
    const avatarUrl = `https://picsum.photos/id/${10 + newId}/200/200`;
    const employeeToAdd: Employee = { ...newEmployee, id: newId, avatarUrl };

    setEmployeeList(prevList => [employeeToAdd, ...prevList]);
  };
  
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployeeList(prevList => 
        prevList.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;
    setEmployeeList(prevList => prevList.filter(emp => emp.id !== employeeToDelete.id));
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleExportCSV = () => {
    const headers = Object.keys(employees[0]).join(',');
    const rows = employeeList.map(emp => Object.values(emp).map(val => `"${val}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_pegawai_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].trim().split(',') as (keyof Employee)[];
        
        let updatedCount = 0;
        let addedCount = 0;

        const newEmployeeList = [...employeeList];

        lines.slice(1).forEach(line => {
            const values = line.trim().split(',');
            const employeeData = headers.reduce((obj, header, index) => {
                obj[header] = values[index].replace(/"/g, '');
                return obj;
            }, {} as any) as Employee;

            const existingEmployeeIndex = newEmployeeList.findIndex(emp => emp.id === employeeData.id);

            if(existingEmployeeIndex > -1) {
                newEmployeeList[existingEmployeeIndex] = employeeData;
                updatedCount++;
            } else {
                newEmployeeList.push(employeeData);
                addedCount++;
            }
        });

        setEmployeeList(newEmployeeList);
        alert(`Impor berhasil! ${addedCount} pegawai ditambahkan, ${updatedCount} pegawai diperbarui.`);

      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Gagal memproses file CSV. Pastikan formatnya benar.");
      }
    };
    
    reader.onerror = () => {
        alert("Gagal membaca file.");
    };

    reader.readAsText(file);
    event.target.value = '';
  };


  return (
    <>
      <div className="bg-surface p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-subtle" />
              </div>
              <input
                type="text"
                placeholder="Cari pegawai..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                onChange={e => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
            <div className="w-full sm:w-48">
                <select
                    id="department-filter"
                    value={departmentFilter}
                    onChange={e => setDepartmentFilter(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                    <option value="">Semua Departemen</option>
                    {uniqueDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
            </div>
            <div className="w-full sm:w-40">
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <button 
              onClick={handleImportClick}
              className="flex items-center justify-center bg-white text-on-surface border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors text-sm font-medium">
              <ArrowUpTrayIcon className="mr-2 h-5 w-5"/>
              Impor CSV
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center bg-white text-on-surface border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors text-sm font-medium">
              <DownloadIcon className="mr-2 h-5 w-5"/>
              Ekspor CSV
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors text-sm font-medium">
              <PlusIcon className="mr-2 h-5 w-5"/>
              Tambah Pegawai
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">NIP</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Jabatan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tgl Bergabung</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee: Employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={employee.avatarUrl} alt={`Avatar of ${employee.name}`} />
                      </div>
                      <div className="ml-4">
                        <div
                          className="text-sm font-medium text-on-surface hover:text-primary cursor-pointer transition-colors"
                          onClick={() => handleViewDetails(employee)}
                        >
                          {employee.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{employee.nip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-on-surface">{employee.position}</div>
                    <div className="text-sm text-subtle">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{new Date(employee.joinDate).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleOpenEditModal(employee)}
                        className="text-primary hover:text-primary-dark transition-colors flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1"/> Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(employee)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1"/> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={selectedEmployee}
      />
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateEmployee}
        employee={selectedEmployee}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteEmployee}
        title="Konfirmasi Hapus Pegawai"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="red"
      >
        <p>
            Apakah Anda yakin ingin menghapus data pegawai{' '}
            <strong>{employeeToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </>
  );
};

export default DataPegawai;