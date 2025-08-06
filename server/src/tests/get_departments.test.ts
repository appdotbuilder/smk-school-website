
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { getDepartments } from '../handlers/get_departments';

describe('getDepartments', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no departments exist', async () => {
    const result = await getDepartments();
    
    expect(result).toEqual([]);
  });

  it('should return all departments', async () => {
    // Create test departments
    await db.insert(departmentsTable)
      .values([
        {
          name: 'Computer Science',
          description: 'Department of Computer Science and Engineering',
          head_of_department: 'Dr. Smith'
        },
        {
          name: 'Mathematics',
          description: 'Department of Mathematics and Statistics',
          head_of_department: null
        }
      ])
      .execute();

    const result = await getDepartments();

    expect(result).toHaveLength(2);
    
    // Verify first department
    const csDept = result.find(dept => dept.name === 'Computer Science');
    expect(csDept).toBeDefined();
    expect(csDept!.description).toEqual('Department of Computer Science and Engineering');
    expect(csDept!.head_of_department).toEqual('Dr. Smith');
    expect(csDept!.id).toBeDefined();
    expect(csDept!.created_at).toBeInstanceOf(Date);
    expect(csDept!.updated_at).toBeInstanceOf(Date);

    // Verify second department
    const mathDept = result.find(dept => dept.name === 'Mathematics');
    expect(mathDept).toBeDefined();
    expect(mathDept!.description).toEqual('Department of Mathematics and Statistics');
    expect(mathDept!.head_of_department).toBeNull();
    expect(mathDept!.id).toBeDefined();
    expect(mathDept!.created_at).toBeInstanceOf(Date);
    expect(mathDept!.updated_at).toBeInstanceOf(Date);
  });

  it('should return departments ordered by insertion order', async () => {
    // Insert departments in specific order
    await db.insert(departmentsTable)
      .values({
        name: 'Physics',
        description: 'Department of Physics',
        head_of_department: 'Dr. Einstein'
      })
      .execute();

    await db.insert(departmentsTable)
      .values({
        name: 'Chemistry',
        description: 'Department of Chemistry',
        head_of_department: 'Dr. Curie'
      })
      .execute();

    const result = await getDepartments();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Physics');
    expect(result[1].name).toEqual('Chemistry');
  });
});
